import { Request, Response } from 'express';
import { ChangeQuantitySchema, CreateCartSchema } from '../schema/cart';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';
import { Product } from '@prisma/client';
import { prismaClient } from '..';
import { RequestCustom } from '../types/express';

export const addItemToCart =async (req: RequestCustom, res: Response) => {
    const validatedData = CreateCartSchema.parse(req.body)
    // Check for the existence of the same product in user's cart and alter the quantity as required
    const existingCartItem = await prismaClient.cartItem.findFirst({
        where: {
            userId: req.user.id,
            productId: validatedData.productId
        }
    })
    if(existingCartItem) {
        const updatedCart = await prismaClient.cartItem.update({
            where: {
                id: existingCartItem.id
            },
            data: {
                quantity: existingCartItem.quantity + validatedData.quantity
            }
        })
        return res.json(updatedCart)
    }
    
    let product: Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })
    } catch(err) {
        throw new NotFoundException('Product not found!', ErrorCode.PRODUCT_NOT_FOUND)
    }
    const cart = await prismaClient.cartItem.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validatedData.quantity
        }
    })
    res.json(cart)
}

export const deleteItemFromCart =async (req: RequestCustom, res: Response) => {
    // Check if user is deleting its own cart item
    const cartItem= await prismaClient.cartItem.findFirst({
        where:{
            id: +req.params.id,
            userId: req.user.id
        }
    });
    if(!cartItem){
        throw new NotFoundException('Product Not Found', ErrorCode.PRODUCT_NOT_FOUND)
    }


    await prismaClient.cartItem.delete({
        where:{
            id: +req.params.id
        }
    })
    res.json({success: true})
    
}

export const changeQuantity =async (req: RequestCustom, res: Response) => {
    const validatedData = ChangeQuantitySchema.parse(req.body);
    
    // Check if user is updating its own cart item
 
    const cartItem= await prismaClient.cartItem.findFirst({
        where:{
            id: +req.params.id,
            userId: req.user.id
        }
    });
    if(!cartItem){
        throw new NotFoundException('Product Not Found', ErrorCode.PRODUCT_NOT_FOUND)
    }
    const updatedCart = await prismaClient.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }
    })

    res.json(updatedCart)
    
}

export const getCart =async (req: RequestCustom, res: Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user.id
        },
        include:{
            product: true
        }
    })
    res.json(cart)
}