import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export default redis;

export class BestellnummerIdGenerator {
  private redis: Redis;
  private shopId: string;
  
  constructor(shopId: string) {
    this.redis = redis;
    this.shopId = shopId;
  }
  
  async generateUniqueId(length: number, prefix: string = '', suffix: string = ''): Promise<string> {
    const maxAttempts = 20;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Generate random numeric ID
      const max = Math.pow(10, length);
      const min = Math.pow(10, length - 1);
      const numericId = Math.floor(Math.random() * (max - min) + min).toString();
      
      const fullId = `${prefix}${numericId}${suffix}`;
      const reservationKey = `bestell:${this.shopId}:${fullId}`;
      
      // Try to reserve in Redis (5 min TTL)
      const reserved = await this.redis.setnx(reservationKey, '1');
      if (!reserved) continue;
      
      await this.redis.expire(reservationKey, 300);
      
      // Check uniqueness in Shopify (this will be implemented in the API)
      // For now, return the generated ID
      return fullId;
    }
    
    throw new Error('Failed to generate unique Bestellnummer ID after maximum attempts');
  }
  
  async releaseReservation(id: string): Promise<void> {
    const reservationKey = `bestell:${this.shopId}:${id}`;
    await this.redis.del(reservationKey);
  }
}