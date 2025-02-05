import LRU from "lru-cache";

const cache = new LRU({ max: 500, ttl: 1000 * 60 * 5 });
export default cache;
