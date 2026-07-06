const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const company = await prisma.company.findFirst();
    if (!company) {
      console.log('No company found');
      return;
    }
    
    let unit = await prisma.unit.findFirst({ where: { company_id: company.id, name: 'PCS' }});
    if (!unit) {
      unit = await prisma.unit.create({ data: { company_id: company.id, name: 'PCS' }});
    }

    const product = await prisma.product.create({
      data: {
        company_id: company.id,
        code: `PRD-${Date.now()}`,
        name: 'testr',
        description: 'test',
        purchase_price: 20000,
        selling_price: 50000,
        unit_id: unit.id
      }
    });
    console.log('Product created:', product);
  } catch (e) {
    console.error('Error creating product:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
