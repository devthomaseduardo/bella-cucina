
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "menu_categories": {
                  Row: {
                    "created_at": string | null,"id": string,"name_en": string,"name_it": string,"name_pt": string,"order": number,"slug": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"id"?: string,"name_en": string,"name_it": string,"name_pt": string,"order"?: number,"slug"?: string | null
                  }
                  Update: {
                    "created_at"?: string | null,"id"?: string,"name_en"?: string,"name_it"?: string,"name_pt"?: string,"order"?: number,"slug"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"menu_items": {
                  Row: {
                    "available": boolean,"category_id": string | null,"created_at": string | null,"description_en": string,"description_it": string,"description_pt": string,"dietary": (string)[] | null,"id": string,"image_url": string | null,"name_en": string,"name_it": string,"name_pt": string,"order": number,"popular": boolean | null,"price": number,"slug": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "available"?: boolean,"category_id"?: string | null,"created_at"?: string | null,"description_en": string,"description_it": string,"description_pt": string,"dietary"?: (string)[] | null,"id"?: string,"image_url"?: string | null,"name_en": string,"name_it": string,"name_pt": string,"order"?: number,"popular"?: boolean | null,"price": number,"slug"?: string | null
                  }
                  Update: {
                    "available"?: boolean,"category_id"?: string | null,"created_at"?: string | null,"description_en"?: string,"description_it"?: string,"description_pt"?: string,"dietary"?: (string)[] | null,"id"?: string,"image_url"?: string | null,"name_en"?: string,"name_it"?: string,"name_pt"?: string,"order"?: number,"popular"?: boolean | null,"price"?: number,"slug"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "menu_items_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "menu_categories"
      referencedColumns: ["id"]
    }
                  ]
                },"order_items": {
                  Row: {
                    "category": string | null,"created_at": string | null,"customer_name": string | null,"guest_id": string | null,"id": string,"image_url": string | null,"menu_item_id": string | null,"name": string,"notes": string | null,"order_id": string | null,"price": number,"quantity": number,"session_id": string | null,"status": string
                  }
                  ComputedFields: never
                  Insert: {
                    "category"?: string | null,"created_at"?: string | null,"customer_name"?: string | null,"guest_id"?: string | null,"id"?: string,"image_url"?: string | null,"menu_item_id"?: string | null,"name": string,"notes"?: string | null,"order_id"?: string | null,"price": number,"quantity": number,"session_id"?: string | null,"status"?: string
                  }
                  Update: {
                    "category"?: string | null,"created_at"?: string | null,"customer_name"?: string | null,"guest_id"?: string | null,"id"?: string,"image_url"?: string | null,"menu_item_id"?: string | null,"name"?: string,"notes"?: string | null,"order_id"?: string | null,"price"?: number,"quantity"?: number,"session_id"?: string | null,"status"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "order_items_guest_id_fkey"
      columns: ["guest_id"]
isOneToOne: false
      referencedRelation: "table_guests"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "order_items_menu_item_id_fkey"
      columns: ["menu_item_id"]
isOneToOne: false
      referencedRelation: "menu_items"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "order_items_order_id_fkey"
      columns: ["order_id"]
isOneToOne: false
      referencedRelation: "orders"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "order_items_session_id_fkey"
      columns: ["session_id"]
isOneToOne: false
      referencedRelation: "table_sessions"
      referencedColumns: ["id"]
    }
                  ]
                },"orders": {
                  Row: {
                    "created_at": string | null,"customer_name": string | null,"guest_id": string | null,"id": string,"session_id": string | null,"status": string,"table_number": string,"total_price": number,"updated_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"customer_name"?: string | null,"guest_id"?: string | null,"id"?: string,"session_id"?: string | null,"status"?: string,"table_number": string,"total_price": number,"updated_at"?: string | null
                  }
                  Update: {
                    "created_at"?: string | null,"customer_name"?: string | null,"guest_id"?: string | null,"id"?: string,"session_id"?: string | null,"status"?: string,"table_number"?: string,"total_price"?: number,"updated_at"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "orders_guest_id_fkey"
      columns: ["guest_id"]
isOneToOne: false
      referencedRelation: "table_guests"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "orders_session_id_fkey"
      columns: ["session_id"]
isOneToOne: false
      referencedRelation: "table_sessions"
      referencedColumns: ["id"]
    }
                  ]
                },"reservations": {
                  Row: {
                    "created_at": string | null,"customer_email": string,"customer_name": string,"customer_phone": string,"datetime_iso": string,"id": string,"party_size": number,"special_requests": string | null,"status": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"customer_email": string,"customer_name": string,"customer_phone": string,"datetime_iso": string,"id"?: string,"party_size": number,"special_requests"?: string | null,"status"?: string
                  }
                  Update: {
                    "created_at"?: string | null,"customer_email"?: string,"customer_name"?: string,"customer_phone"?: string,"datetime_iso"?: string,"id"?: string,"party_size"?: number,"special_requests"?: string | null,"status"?: string
                  }
                  Relationships: [
                    
                  ]
                },"restaurant_tables": {
                  Row: {
                    "active": boolean,"created_at": string | null,"id": string,"number": string,"qr_token": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"created_at"?: string | null,"id"?: string,"number": string,"qr_token"?: string
                  }
                  Update: {
                    "active"?: boolean,"created_at"?: string | null,"id"?: string,"number"?: string,"qr_token"?: string
                  }
                  Relationships: [
                    
                  ]
                },"staff_members": {
                  Row: {
                    "active": boolean,"created_at": string,"role": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"created_at"?: string,"role": string,"user_id": string
                  }
                  Update: {
                    "active"?: boolean,"created_at"?: string,"role"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"table_guests": {
                  Row: {
                    "id": string,"joined_at": string,"name": string,"session_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: string,"joined_at"?: string,"name": string,"session_id": string,"user_id": string
                  }
                  Update: {
                    "id"?: string,"joined_at"?: string,"name"?: string,"session_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "table_guests_session_id_fkey"
      columns: ["session_id"]
isOneToOne: false
      referencedRelation: "table_sessions"
      referencedColumns: ["id"]
    }
                  ]
                },"table_sessions": {
                  Row: {
                    "closed_at": string | null,"created_at": string,"id": string,"opened_at": string,"status": string,"table_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "closed_at"?: string | null,"created_at"?: string,"id"?: string,"opened_at"?: string,"status"?: string,"table_id": string
                  }
                  Update: {
                    "closed_at"?: string | null,"created_at"?: string,"id"?: string,"opened_at"?: string,"status"?: string,"table_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "table_sessions_table_id_fkey"
      columns: ["table_id"]
isOneToOne: false
      referencedRelation: "restaurant_tables"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "has_staff_role":
{ Args: { "p_roles": (string)[] }; Returns: boolean
                           },
"is_staff_session":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"join_table_session_by_token":
{ Args: { "p_guest_name": string,"p_table_token": string }; Returns: {
              "guest_id": string,"session_id": string,"table_number": string
            }[]
                           },
"place_order":
{ Args: { "p_guest_id": string,"p_items": Json,"p_session_id": string }; Returns: string
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
