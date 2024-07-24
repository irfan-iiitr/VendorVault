import { Request, Response } from "express"
import { prismaClient } from "../index";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";


export const createProduct = async(req:Request, res:Response) => {

    // ["tea","india"] => "tea,india"

    // Create a validator to for this request

    const products= await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })
    res.json(products)

}


export const updateProduct =async (req: Request, res: Response) => {
    try {
        const product = req.body;
        if(product.tags) {
            product.tags = product.tags.join(',')
        }
        const updateProduct  = await prismaClient.product.update({
            where: {
                id: +req.params.id //type-cast to number
            },
            data: product
        })
        res.json(updateProduct)

    } catch(err) {
        throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const deleteProduct =async (req: Request, res: Response) => {
       try{
        const product = await prismaClient.product.delete({
            where: {
                id: +req.params.id
            }
        })
        res.json(product);
       }
       catch(err){
        throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND)
       }
    }
    
export const listProducts =async (req: Request, res: Response) => {
        // {
        //     count: 100,
        //     data: []
        // }
    
        const count = await prismaClient.product.count()
        const products = await prismaClient.product.findMany({
            skip:req.query.skip?+req.query.skip:0,
            take: 5
        })
        res.json({
            count, data:products
        })
        
    }
    
    export const getProductById =async (req: Request, res: Response) => {
        try {
            const product = await prismaClient.product.findFirstOrThrow({
                where: {
                    id: +req.params.id
                }
            })
            res.json(product)
        } catch(err) {
            console.log(err)
            throw new NotFoundException('Product not found.', ErrorCode.PRODUCT_NOT_FOUND)
        }
        
    }
    

export const searchProducts = async (req: Request, res: Response) => {
        // Extract the page and limit from the query parameters
        const page = req.query.page ? +req.query.page : 1;
        const limit = req.query.limit ? +req.query.limit : 10;
        const offset = (page - 1) * limit;

    const products = await prismaClient.product.findMany({
            where: {
                name: {
                    contains: req.query.q ? req.query.q.toString() : '',
                },
                description: {
                    contains: req.query.q ? req.query.q.toString() : '',
                },
                tags: {
                    contains: req.query.q ? req.query.q.toString() : '',
                },
            },
            skip: offset, //skip the first offset records
            take: limit, //this is the limit of the records
        });

        // Send the products as a JSON response
        res.json(products);
}