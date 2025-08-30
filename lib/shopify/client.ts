import { GraphQLClient } from 'graphql-request';
import { prisma } from '../database';

export interface ShopifyConfig {
  shop: string;
  accessToken: string;
}

export class ShopifyClient {
  private client: GraphQLClient;
  private shop: string;
  
  constructor(config: ShopifyConfig) {
    this.shop = config.shop;
    this.client = new GraphQLClient(
      `https://${config.shop}/admin/api/2024-01/graphql.json`,
      {
        headers: {
          'X-Shopify-Access-Token': config.accessToken,
          'Content-Type': 'application/json',
        },
      }
    );
  }
  
  async searchCustomerByBestellId(bestellId: string): Promise<boolean> {
    const query = `
      query searchCustomers($query: String!) {
        customers(first: 1, query: $query) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;
    
    try {
      const result = await this.client.request<any>(query, {
        query: `tag:${bestellId} OR metafield:custom.bestellnummer_id:${bestellId}`
      });
      
      return result.customers.edges.length > 0;
    } catch (error) {
      console.error('Error searching customers:', error);
      return false;
    }
  }
  
  async createOrUpdateCustomer(data: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    socialName: string;
    bestellId: string;
    tags?: string[];
  }): Promise<{ customerId: string; success: boolean; errors?: string[] }> {
    // First check if customer exists
    const existingCustomer = await this.findCustomerByEmail(data.email);
    
    if (existingCustomer) {
      return this.updateCustomer(existingCustomer.id, data);
    } else {
      return this.createCustomer(data);
    }
  }
  
  private async findCustomerByEmail(email: string): Promise<{ id: string } | null> {
    const query = `
      query getCustomerByEmail($query: String!) {
        customers(first: 1, query: $query) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;
    
    try {
      const result = await this.client.request<any>(query, {
        query: `email:${email}`
      });
      
      return result.customers.edges.length > 0 ? result.customers.edges[0].node : null;
    } catch (error) {
      console.error('Error finding customer:', error);
      return null;
    }
  }
  
  private async createCustomer(data: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    socialName: string;
    bestellId: string;
    tags?: string[];
  }): Promise<{ customerId: string; success: boolean; errors?: string[] }> {
    const mutation = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    const tags = [data.socialName, data.bestellId, ...(data.tags || [])];
    
    const input = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      tags,
      metafields: [
        {
          namespace: 'custom',
          key: 'social_name',
          type: 'single_line_text_field',
          value: data.socialName
        },
        {
          namespace: 'custom',
          key: 'bestellnummer_id',
          type: 'single_line_text_field',
          value: data.bestellId
        }
      ]
    };
    
    try {
      const result = await this.client.request<any>(mutation, { input });
      
      if (result.customerCreate.userErrors.length > 0) {
        return {
          customerId: '',
          success: false,
          errors: result.customerCreate.userErrors.map((e: any) => e.message)
        };
      }
      
      return {
        customerId: result.customerCreate.customer.id,
        success: true
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      return {
        customerId: '',
        success: false,
        errors: ['Failed to create customer']
      };
    }
  }
  
  private async updateCustomer(customerId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    socialName: string;
    bestellId: string;
    tags?: string[];
  }): Promise<{ customerId: string; success: boolean; errors?: string[] }> {
    const mutation = `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            tags
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    const tags = [data.socialName, data.bestellId, ...(data.tags || [])];
    
    const input = {
      id: customerId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      tags,
      metafields: [
        {
          namespace: 'custom',
          key: 'social_name',
          type: 'single_line_text_field',
          value: data.socialName
        },
        {
          namespace: 'custom',
          key: 'bestellnummer_id',
          type: 'single_line_text_field',
          value: data.bestellId
        }
      ]
    };
    
    try {
      const result = await this.client.request<any>(mutation, { input });
      
      if (result.customerUpdate.userErrors.length > 0) {
        return {
          customerId,
          success: false,
          errors: result.customerUpdate.userErrors.map((e: any) => e.message)
        };
      }
      
      return {
        customerId,
        success: true
      };
    } catch (error) {
      console.error('Error updating customer:', error);
      return {
        customerId,
        success: false,
        errors: ['Failed to update customer']
      };
    }
  }
  
  async createMetafieldDefinitions(): Promise<boolean> {
    const mutation = `
      mutation metafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          createdDefinition {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    const definitions = [
      {
        namespace: 'custom',
        key: 'social_name',
        name: 'Social Name',
        type: 'single_line_text_field',
        ownerType: 'CUSTOMER',
        description: 'Customer social media name or handle'
      },
      {
        namespace: 'custom',
        key: 'bestellnummer_id',
        name: 'Bestellnummer ID',
        type: 'single_line_text_field',
        ownerType: 'CUSTOMER',
        description: 'Auto-generated unique order/customer identification number'
      }
    ];
    
    try {
      for (const definition of definitions) {
        await this.client.request(mutation, { definition });
      }
      return true;
    } catch (error) {
      console.error('Error creating metafield definitions:', error);
      return false;
    }
  }
}

export async function getShopifyClient(shop: string): Promise<ShopifyClient | null> {
  try {
    const shopRecord = await prisma.shop.findUnique({
      where: { shop }
    });
    
    if (!shopRecord) return null;
    
    return new ShopifyClient({
      shop: shopRecord.shop,
      accessToken: shopRecord.accessToken
    });
  } catch (error) {
    console.error('Error getting Shopify client:', error);
    return null;
  }
}