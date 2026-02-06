import { prisma } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

async function main() {
  const adminPass = await hashPassword("AdminPass123!");
  const customerPass = await hashPassword("CustomerPass123!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@brewcraft.com" },
    update: {},
    create: {
      email: "admin@brewcraft.com",
      name: "Admin",
      passwordHash: adminPass,
      role: "admin",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@brewcraft.com" },
    update: {},
    create: {
      email: "customer@brewcraft.com",
      name: "Jamie",
      passwordHash: customerPass,
      role: "customer",
    },
  });

  const espresso = await prisma.category.upsert({
    where: { name: "Espresso" },
    update: {},
    create: { name: "Espresso", order: 1 },
  });

  const coldBrew = await prisma.category.upsert({
    where: { name: "Cold Brew" },
    update: {},
    create: { name: "Cold Brew", order: 2 },
  });

  const latte = await prisma.menuItem.create({
    data: {
      name: "Vanilla Latte",
      description: "Smooth espresso with vanilla syrup and steamed milk.",
      price: 4.5,
      currency: "USD",
      imageUrl: "https://images.example.com/latte.jpg",
      categoryId: espresso.id,
      available: true,
      variants: [{ name: "Small", price: 4.0 }, { name: "Large", price: 5.0 }],
    },
  });

  const coldBrewItem = await prisma.menuItem.create({
    data: {
      name: "House Cold Brew",
      description: "Slow-steeped for a smooth, bold finish.",
      price: 4.0,
      currency: "USD",
      imageUrl: "https://images.example.com/coldbrew.jpg",
      categoryId: coldBrew.id,
      available: true,
    },
  });

  await prisma.review.create({
    data: {
      menuItemId: latte.id,
      userId: customer.id,
      rating: 5,
      comment: "Best latte in town!",
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      total: 8.5,
      status: "confirmed",
      fulfillment: "pickup",
      contact: { name: "Jamie", email: "customer@brewcraft.com" },
      items: {
        create: [
          { menuItemId: latte.id, quantity: 1, price: 4.5 },
          { menuItemId: coldBrewItem.id, quantity: 1, price: 4.0 },
        ],
      },
    },
  });

  await prisma.reservation.create({
    data: {
      name: "Jamie",
      contact: "customer@brewcraft.com",
      partySize: 2,
      datetime: new Date(Date.now() + 86400000),
      status: "confirmed",
    },
  });

  console.log({ admin, customer, orderId: order.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
