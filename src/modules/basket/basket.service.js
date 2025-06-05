const {
  Product,
  ProductColor,
  ProductSize,
} = require("../product/product.model");
const createHttpError = require("http-errors");
const { ProductTypes } = require("../../common/constant/product.const");
const { Basket } = require("./basket.model");

/**
 * افزودن محصول به سبد خرید
 * @param {Object} req - درخواست HTTP
 * @param {Object} res - پاسخ HTTP
 * @param {Function} next - میدلور بعدی
 */
async function addToBasketHandler(req, res, next) {
  try {
    // دریافت شناسه کاربر از توکن (اگر لاگین کرده باشد)
    const { id: userId = undefined } = req.user ?? {};

    // دریافت اطلاعات محصول از بدنه درخواست
    const { productId, sizeId, colorId } = req.body;

    // بررسی وجود محصول در دیتابیس
    const product = await Product.findByPk(productId);
    if (!product) {
      throw createHttpError(400, "Product not found");
    }

    // ایجاد آبجکت پایه برای آیتم سبد خرید
    const basketItem = {
      userId,
      productId: product.id,
    };

    // متغیرهای نگهدارنده موجودی محصول
    let colorCount = undefined;
    let productCount = undefined;
    let sizeCount = undefined;

    // بررسی نوع محصول و اعتبارسنجی‌های مربوطه
    if (product.type === ProductTypes.Coloring) {
      // برای محصولات رنگی
      if (!colorId) throw createHttpError(400, "Coloring color not found");

      const productColor = await ProductColor.findByPk(colorId);
      if (!productColor) throw createHttpError(404, "not found color");

      basketItem["colorId"] = colorId;
      colorCount = productColor.count ?? 0;

      if (colorCount === 0)
        throw createHttpError(400, "product count not enough");
    } else if (product.type === ProductTypes.Sizing) {
      // برای محصولات سایزدار
      if (!sizeId)
        throw createHttpError(400, "send product color count detail");

      const productSize = await ProductSize.findByPk(sizeId);
      if (!productSize) throw createHttpError(404, "not found size");

      basketItem["sizeId"] = sizeId;
      sizeCount = productSize.count ?? 0;

      if (sizeCount === 0)
        throw createHttpError(400, "product size count not enough");
    } else {
      // برای محصولات معمولی
      productCount = product.count ?? 0;
      if (productCount === 0)
        throw createHttpError(400, "product count not enough");
    }

    // بررسی وجود محصول در سبد خرید
    const basket = await Basket.findOne({ where: basketItem });

    if (basket) {
      // اگر محصول در سبد وجود دارد، تعداد آن را افزایش می‌دهیم
      if (sizeCount && sizeCount > basket?.count) {
        basket.count += 1;
      } else if (colorCount && colorCount > basket?.count) {
        basket.count += 1;
      } else if (productCount && productCount > basket?.count) {
        basket.count += 1;
      } else {
        throw createHttpError(400, "product count not enough");
      }

      await basket.save();
    } else {
      // اگر محصول در سبد وجود ندارد، آن را اضافه می‌کنیم
      await Basket.create({ ...basketItem, count: 1 });
    }

    // ارسال پاسخ موفقیت‌آمیز
    return res.json({
      message: "added to basket successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function getUserBasketHandler(req, res, next) {
  try {
    const { id: userId = undefined } = req.user ?? {};

    const basketItems = await Basket.findAll({
      where: { userId },
      include: [
        { model: Product, as: "product" },
        { model: ProductColor, as: "color" },
        { model: ProductSize, as: "size" },
      ],
    });

    // محاسبه اطلاعات کلی سبد خرید
    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItems = 0;

    // تبدیل آیتم‌های سبد خرید به ساختار بهینه
    const items = basketItems.map(item => {
      const basePrice = item.color?.price || item.size?.price || item.product.price;
      const discount = item.color?.active_discount ? item.color.discount : 
                      (item.product.active_discount ? item.product.discount : 0);
      
      const itemPrice = Number(basePrice) * item.count;
      const itemDiscountedPrice = itemPrice * (1 - (discount / 100));

      totalPrice += itemPrice;
      totalDiscountedPrice += itemDiscountedPrice;
      totalItems += item.count;

      return {
        basketItemId: item.id,
        product: {
          id: item.product.id,
          title: item.product.title,
          description: item.product.description,
          type: item.product.type
        },
        variant: {
          type: item.color ? 'color' : (item.size ? 'size' : 'normal'),
          ...(item.color && {
            color: {
              name: item.color.color_name,
              code: item.color.color_code
            }
          }),
          ...(item.size && {
            size: {
              id: item.size.id,
              name: item.size.size_name
            }
          })
        },
        pricing: {
          originalPrice: Number(basePrice),
          discount: discount,
          finalPrice: Number(basePrice) * (1 - (discount / 100)),
          totalPrice: itemPrice,
          totalDiscountedPrice: itemDiscountedPrice
        },
        inventory: {
          count: item.count,
          availableStock: item.color?.count || item.size?.count || item.product.count
        }
      };
    });

    return res.json({
      status: "success",
      message: "سبد خرید با موفقیت دریافت شد",
      data: {
        summary: {
          totalItems,
          totalPrice,
          totalDiscountedPrice,
          totalDiscount: totalPrice - totalDiscountedPrice
        },
        items
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addToBasketHandler,
  getUserBasketHandler,
};
