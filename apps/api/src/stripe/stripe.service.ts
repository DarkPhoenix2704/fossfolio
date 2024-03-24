import { Injectable } from '@nestjs/common';
import { Events } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe;
    private readonly prisma: PrismaService;
    private readonly configService: ConfigService;

    constructor(prisma: PrismaService, config: ConfigService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });

        this.prisma = prisma;
        this.configService = config;
    }

    async handleWebHookEvent(body, signature) {
        try {
            const event = this.stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET,
            );
            if (event.type === 'payment_intent.created') {
                const eventInfo = event.data.object.metadata;
                const { event_id, user_id } = eventInfo;
                if (!event_id || !user_id) {
                    throw new Error('Invalid metadata');
                } else {
                    const event = await this.prisma.events.findUnique({
                        where: {
                            id: event_id,
                        },
                    });

                    await this.prisma.events.update({
                        where: {
                            id: event_id,
                        },
                        data: {
                            Ticket: {
                                create: {
                                    userUid: user_id,
                                },
                            },
                            maxTicketCount: event.maxTicketCount - 1,
                        },
                    });
                }
            }
        } catch (e) {
            console.log(e);
            throw new Error('Failed to handle payments');
        }
    }

    async createProductObject(event: Events): Promise<string> {
        try {
            const product = await this.stripe.products.create({
                name: event.name,
                description: event.name,
                images: [event.coverImage],
                shippable: false,
                metadata: {
                    event_id: event.id,
                },
            });

            await this.prisma.events.update({
                where: {
                    id: event.id,
                },
                data: {
                    stripe_product_object: product.id,
                },
            });

            return product.id;
        } catch (error) {
            console.error('Stripe API Error:', error);
            throw new Error('Failed to create product  object');
        }
    }

    async createProductPricingObject(event: Events): Promise<string> {
        try {
            let stripe_product_object = '';
            if (!event.stripe_product_object) {
                stripe_product_object = await this.createProductObject(event);
            } else {
                stripe_product_object = event.stripe_product_object;
            }
            const price = await this.stripe.prices.create({
                product: stripe_product_object,
                unit_amount: event.ticketPrice * 100, // amount in inr , stripe default takes paisa in inr so we conver that to rupee
                currency: 'inr',
            });

            await this.prisma.events.update({
                where: {
                    id: event.id,
                },
                data: {
                    stripe_price_object: price.id,
                },
            });

            return price.id;
        } catch (error) {
            console.error('Stripe API Error:', error);
            throw new Error('Failed to create product pricing object');
        }
    }

    async createCheckoutSession(items: Events, user: string): Promise<CheckOutReturnProp> {
        try {
            const webUrl = this.configService.get<string>('WEB_URL');
            // if there is already stripe_payment_object we will use it else we will create another one
            let price_object = '';
            if (!items.stripe_price_object) {
                price_object = await this.createProductPricingObject(items);
            } else {
                price_object = items.stripe_price_object;
            }

            const session = await this.stripe.checkout.sessions.create({
                metadata: {
                    user_id: user,
                    event_id: items.id,
                    event_image: items.coverImage,
                    event_name: items.name,
                },
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: price_object,
                        quantity: 1,
                        // one user can only buy one ticket for now
                    },
                ],
                mode: 'payment',
                // might need to create a success page then redirect to tickets page
                success_url: webUrl + '/tickets',
                // can show a toast in frontend
                cancel_url: webUrl + '/events?payment_error=true',
            });

            return { sessionId: session.id, url: session.url };
        } catch (error) {
            throw new Error('Failed to create checkout');
        }
    }
}

type CheckOutReturnProp = {
    sessionId: string;
    url: string;
};
