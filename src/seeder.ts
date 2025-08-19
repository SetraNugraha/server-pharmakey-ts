import generateSlug from "./utils/generateSlug";
import bcrypt from "bcrypt";
import { prisma } from "./config/database";

async function main() {
  // if schema modified
  await prisma.users.deleteMany();
  await prisma.category.deleteMany();
  await prisma.products.deleteMany();

  const salt = await bcrypt.genSalt(10);

  const users = await prisma.users.createMany({
    data: [
      {
        username: "customer",
        email: "customer@gmail.com",
        password: await bcrypt.hash("customer", salt),
        role: "CUSTOMER",
      },
      {
        username: "admin",
        email: "admin@gmail.com",
        password: await bcrypt.hash("admin", salt),
        role: "ADMIN",
      },
    ],
  });

  const categoriesName = [{ name: "Surgicals" }, { name: "Fitness" }, { name: "Diabetes" }, { name: "Vitamins" }];
  const categoriesSlug = categoriesName.map((category) => ({
    ...category,
    slug: generateSlug(category.name),
  }));

  const categories = await prisma.category.createMany({
    data: categoriesSlug,
  });

  const findCategories = await prisma.category.findMany();

  const productsData = [
    {
      name: "Softovac Enoki",
      price: 50000,
      description: "Obat untuk anak dibawah 18 tahun",
    },

    {
      name: "Junior Power",
      price: 17000,
      description: "Obat untuk anak dibawah 6 tahun",
    },

    {
      name: "Panadomal",
      price: 33000,
      description: "Obat pereda sakit kepala ringan",
    },

    {
      name: "Nutrition Assemic",
      price: 89000,
      description: "Vitamin untuk penunjungan tulang",
    },
  ];

  const productsSlug = productsData.map((product, index) => ({
    ...product,
    category_id: findCategories[index].id,
    slug: generateSlug(product.name),
  }));
  const product = await prisma.products.createMany({
    data: productsSlug,
  });

  console.log("Seeding Successfuly");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
