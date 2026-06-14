import { orderRepository } from "../repositories/order.repository.js";
import { customerRepository } from "../repositories/customer.repository.js";
import type { CreateOrderDTO } from "../validators/order.validator.js";

export const orderService = {
  async createOrder(data: CreateOrderDTO) {
    const order = await orderRepository.create(data);
    await customerRepository.updateDenormalizedFields(data.customerId);
    return order;
  },

  async getOrdersByCustomer(customerId: string) {
    return orderRepository.findByCustomerId(customerId);
  },
};
