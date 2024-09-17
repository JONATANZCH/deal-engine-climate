import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private cache = new Map<string, { value: any; expiry: number }>();
  private hitCount = 0;
  private missCount = 0;

  async get(key: string): Promise<any> {
    const cached = this.cache.get(key);
    if (!cached) {
      this.missCount++;
      return null;
    }

    const now = Date.now();
    if (now > cached.expiry) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    this.hitCount++;
    return cached.value;
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    const now = Date.now();
    const expiry = now + ttl * 1000;
    this.cache.set(key, { value, expiry });
  }

  getStats() {
    return {
      hits: this.hitCount,
      misses: this.missCount,
    };
  }
}
