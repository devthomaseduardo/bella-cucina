  import React, { useState, useEffect } from "react";
  import {
    AlertTriangle,
    Trash2,
    Edit,
    ChefHat,
    Coffee,
    Clock,
    Check,
    Plus,
  } from "lucide-react";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Badge } from "@/components/ui/badge";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { ScrollArea } from "@/components/ui/scroll-area";

  import { useCart, Order } from "../cart/CartContext";
  import QrScannerDialog from "./QrScannerDialog";
  import { supabase } from "@/lib/supabase";
  import { formatPrice } from "@/lib/format";

  interface WaiterPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }

  const WaiterPanel: React.FC<WaiterPanelProps> = ({ open, onOpenChange }) => {
    const {
      importOrder,
      setShowSuccessToast,
      setSuccessMessage,
    } = useCart();
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [scannerOpen, setScannerOpen] = useState(false);
    const [passwordPromptOpen, setPasswordPromptOpen] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [actionToAuth, setActionToAuth] = useState<{ type: "cancel" | "delete", orderId: string, status?: Order["status"] } | null>(null);

    // Fetch orders from Supabase and subscribe to realtime updates
    useEffect(() => {
      if (!open) return;

      const fetchOrders = async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
          return;
        }

        if (data) {
          const mappedOrders: Order[] = data.map(o => ({
            id: o.id,
            tableNumber: o.table_number,
            customerName: o.customer_name || "",
            status: o.status as Order["status"],
            totalPrice: Number(o.total_price),
            createdAt: new Date(o.created_at),
            updatedAt: new Date(o.updated_at),
            items: (o.order_items || []).map((item: any) => ({
              id: item.menu_item_id || item.id,
              name: item.name,
              price: Number(item.price),
              quantity: item.quantity,
              image: item.image_url || "",
              category: item.category || "",
              notes: item.notes || "",
              customerName: item.customer_name || "",
            }))
          }));
          setOrders(mappedOrders);
        }
      };

      fetchOrders();

      const subscription = supabase
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          // Re-fetch everything to ensure we have items (or we could manually merge, but fetching is easier)
          fetchOrders();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }, [open]);

    // Mock data removal
    useEffect(() => {
    }, []);

    const filteredOrders = orders.filter((order) => {
      // Filter by tab
      if (activeTab !== "all" && order.status !== activeTab) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.tableNumber.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query))
        );
      }

      return true;
    });

    const getStatusBadge = (status: Order["status"]) => {
      switch (status) {
        case "pending":
          return (
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 border-yellow-300"
            >
              <Clock className="h-3 w-3 mr-1" /> Pendente
            </Badge>
          );
        case "preparing":
          return (
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 border-blue-300"
            >
              <ChefHat className="h-3 w-3 mr-1" /> Preparando
            </Badge>
          );
        case "ready":
          return (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 border-green-300"
            >
              <Check className="h-3 w-3 mr-1" /> Pronto
            </Badge>
          );
        case "delivered":
          return (
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-800 border-gray-300"
            >
              <Coffee className="h-3 w-3 mr-1" /> Entregue
            </Badge>
          );
        case "cancelled":
          return (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 border-red-300"
            >
              <AlertTriangle className="h-3 w-3 mr-1" /> Cancelado
            </Badge>
          );
        default:
          return <Badge>{status}</Badge>;
      }
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const handleEditOrder = (order: Order) => {
      setEditingOrder({ ...order });
    };

    const handleSaveEdit = async () => {
      if (!editingOrder) return;

      if (editingOrder) {
        await updateOrderStatusLocal(editingOrder.id, editingOrder.status);
      }

      setEditingOrder(null);
    };

    const updateOrderStatusLocal = async (orderId: string, status: Order["status"]) => {
      try {
        await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId);
          
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date() }
              : order,
          ),
        );
      } catch (e) {
        console.error("Failed to update status", e);
      }
    };

    const handleUpdateItemQuantity = (itemId: string, newQuantity: number) => {
      if (!editingOrder) return;

      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        setEditingOrder({
          ...editingOrder,
          items: editingOrder.items.filter((item) => item.id !== itemId),
          totalPrice: editingOrder.items
            .filter((item) => item.id !== itemId)
            .reduce((total, item) => total + item.price * item.quantity, 0),
        });
      } else {
        // Update quantity
        const updatedItems = editingOrder.items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item,
        );

        setEditingOrder({
          ...editingOrder,
          items: updatedItems,
          totalPrice: updatedItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          ),
        });
      }
    };

    const handleUpdateItemNotes = (itemId: string, notes: string) => {
      if (!editingOrder) return;

      setEditingOrder({
        ...editingOrder,
        items: editingOrder.items.map((item) =>
          item.id === itemId ? { ...item, notes } : item,
        ),
      });
    };

    // Removed local polling since we use Supabase Realtime

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Painel do Garçom</DialogTitle>
          </DialogHeader>

          <div className="flex items-center space-x-4 mb-4">
            <Input
              placeholder="Buscar por mesa, pedido ou item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => setScannerOpen(true)}
              className="whitespace-nowrap"
            >
              Escanear QR
            </Button>
            <Button
              variant="default"
              className="bg-primary text-primary-foreground"
              onClick={() => {
                // For a manual order, we can just open the menu section or a simplified version
                // For now, let's just show a toast or a placeholder for the future
                setSuccessMessage("Use o tablet do garçom para realizar pedidos manuais.");
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 3000);
              }}
            >
              Novo Pedido
            </Button>
          </div>

          <QrScannerDialog
            open={scannerOpen}
            onOpenChange={setScannerOpen}
            onApproveOrder={(payload) => {
              if (payload.v === 2) {
                importOrder({
                  id: payload.order.id,
                  tableNumber: payload.order.tableNumber,
                  customerName: payload.order.customerName,
                  items: payload.order.items,
                  status: "preparing",
                  totalPrice: payload.order.totalPrice,
                  createdAt: new Date(payload.order.createdAt),
                  updatedAt: new Date(),
                });
                setSuccessMessage(`Pedido #${payload.order.id} registrado!`);
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 2500);
                return;
              }

              // fallback antigo (v1)
              const exists = orders.some((o) => o.id === payload.orderId);
              if (!exists) {
                setSuccessMessage("Pedido não encontrado no sistema.");
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 2500);
                return;
              }
              updateOrderStatusLocal(payload.orderId, "preparing");
              setSuccessMessage(`Pedido #${payload.orderId} aprovado!`);
              setShowSuccessToast(true);
              setTimeout(() => setShowSuccessToast(false), 2500);
            }}
            onError={(message) => {
              setSuccessMessage(message);
              setShowSuccessToast(true);
              setTimeout(() => setShowSuccessToast(false), 2500);
            }}
          />

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="preparing">Preparando</TabsTrigger>
              <TabsTrigger value="ready">Prontos</TabsTrigger>
              <TabsTrigger value="delivered">Entregues</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <ScrollArea className="h-[400px] pr-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Nenhum pedido encontrado.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold text-lg">
                                Mesa {order.tableNumber}
                              </h3>
                              {order.customerName && (
                                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
                                  {order.customerName}
                                </Badge>
                              )}
                              <span className="mx-2 text-muted-foreground">
                                •
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Pedido #{order.id}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              {getStatusBadge(order.status)}
                              <span className="ml-2 text-xs text-muted-foreground">
                                {formatTime(order.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Editar
                            </Button>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center text-sm"
                            >
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {item.quantity}x
                                  </span>
                                  <span className="ml-2">{item.name}</span>
                                  {item.customerName && (
                                    <span className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-wider font-bold">
                                      {item.customerName}
                                    </span>
                                  )}
                                </div>
                                {item.notes && (
                                  <p className="text-xs italic text-muted-foreground ml-6">
                                    Obs: {item.notes}
                                  </p>
                                )}
                              </div>
                              <span className="text-muted-foreground">
                                {formatPrice((item.price * item.quantity))}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-3 border-t">
                          <span className="font-medium">
                            Total: {formatPrice(order.totalPrice)}
                          </span>
                          <div className="flex space-x-2">
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                onClick={() =>
                                  updateOrderStatusLocal(order.id, "preparing")
                                }
                              >
                                <ChefHat className="h-4 w-4 mr-1" /> Preparando
                              </Button>
                            )}
                            {order.status === "preparing" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-300 text-green-700 hover:bg-green-50"
                                onClick={() =>
                                  updateOrderStatusLocal(order.id, "ready")
                                }
                              >
                                <Check className="h-4 w-4 mr-1" /> Pronto
                              </Button>
                            )}
                            {order.status === "ready" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                onClick={() =>
                                  updateOrderStatusLocal(order.id, "delivered")
                                }
                              >
                                <Coffee className="h-4 w-4 mr-1" /> Entregue
                              </Button>
                            )}
                            {(order.status === "pending" ||
                              order.status === "preparing") && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setActionToAuth({ type: "cancel", orderId: order.id, status: "cancelled" });
                                  setPasswordPromptOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Cancelar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Edit Order Dialog */}
          {editingOrder && (
            <Dialog
              open={!!editingOrder}
              onOpenChange={(open) => !open && setEditingOrder(null)}
            >
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    Editar Pedido - Mesa {editingOrder.tableNumber}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 my-4">
                  {editingOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start border-b pb-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center mt-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              handleUpdateItemQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              handleUpdateItemQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Input
                          className="mt-2 text-sm"
                          placeholder="Observações"
                          value={item.notes || ""}
                          onChange={(e) =>
                            handleUpdateItemNotes(item.id, e.target.value)
                          }
                        />
                      </div>
                      <p className="text-muted-foreground">
                        {formatPrice((item.price * item.quantity))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-medium">
                    {formatPrice(editingOrder.totalPrice)}
                  </span>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingOrder(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {/* Password Protection Dialog */}
          <Dialog open={passwordPromptOpen} onOpenChange={setPasswordPromptOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Autorização Necessária</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Esta ação requer a senha do garçom ou gerente para ser concluída.
                </p>
                <Input
                  type="password"
                  placeholder="Digite a senha..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // Trigger same logic as confirm button
                      document.getElementById("confirm-password-btn")?.click();
                    }
                  }}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setPasswordPromptOpen(false);
                  setPasswordInput("");
                }}>
                  Cancelar
                </Button>
                <Button 
                  id="confirm-password-btn"
                  onClick={() => {
                    // MOCK PASSWORD: 1234
                    if (passwordInput === "1234") {
                      if (actionToAuth?.type === "cancel" && actionToAuth.status) {
                        updateOrderStatusLocal(actionToAuth.orderId, actionToAuth.status);
                        setSuccessMessage("Pedido cancelado com sucesso.");
                      }
                      setShowSuccessToast(true);
                      setTimeout(() => setShowSuccessToast(false), 2000);
                      setPasswordPromptOpen(false);
                      setPasswordInput("");
                      setActionToAuth(null);
                    } else {
                      setSuccessMessage("Senha incorreta!");
                      setShowSuccessToast(true);
                      setTimeout(() => setShowSuccessToast(false), 2000);
                    }
                  }}
                >
                  Confirmar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    );
  };

  export default WaiterPanel;
