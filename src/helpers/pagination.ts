import { Model } from "mongoose";

export async function pagination(
  page: number = 1,
  itemsPage: number = 20,
  model: Model<any>
) {
  if (itemsPage < 1 || itemsPage > 20) itemsPage = 20;
  if (page < 1) page = 1;

  const total = await model.countDocuments({ active: { $ne: false } });
  const pages = Math.ceil(total / itemsPage);

  return {
    page,
    skip: (page - 1) * itemsPage,
    pages,
    itemsPage,
    total,
  };
}
