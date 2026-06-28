import { z } from "zod";

export const paymentMethods = ["credit-card", "paypal", "bitcoin"] as const;

export type PaymentMethod = (typeof paymentMethods)[number];

export const paymentLabels: Record<PaymentMethod, string> = {
  "credit-card": "Credit Card",
  paypal: "PayPal",
  bitcoin: "Bitcoin",
};

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    phone: z.string().trim().min(1, "Phone number is required"),
    address: z.string().trim().min(1, "Address is required"),
    townCity: z.string().trim().min(1, "Town or city is required"),
    pickupLocation: z.string().trim().min(1, "Pickup location is required"),
    pickupDate: z.string().trim().min(1, "Pickup date is required"),
    pickupTime: z.string().trim().min(1, "Pickup time is required"),
    dropoffLocation: z.string().trim().min(1, "Drop-off location is required"),
    dropoffDate: z.string().trim().min(1, "Drop-off date is required"),
    dropoffTime: z.string().trim().min(1, "Drop-off time is required"),
    paymentMethod: z.enum(paymentMethods, {
      error: "Select a payment method",
    }),
    cardNumber: z.string().optional(),
    expirationDate: z.string().optional(),
    cardHolder: z.string().optional(),
    cvc: z.string().optional(),
    marketingEmails: z
      .boolean()
      .refine((value) => value, "Please confirm marketing emails"),
    termsAccepted: z
      .boolean()
      .refine((value) => value, "Please accept the terms and conditions"),
  })
  .superRefine((values, ctx) => {
    if (values.paymentMethod !== "credit-card") {
      return;
    }

    const requiredCardFields = [
      ["cardNumber", "Card number is required"],
      ["expirationDate", "Expiration date is required"],
      ["cardHolder", "Card holder is required"],
      ["cvc", "CVC is required"],
    ] as const;

    requiredCardFields.forEach(([field, message]) => {
      if (!values[field]?.trim()) {
        ctx.addIssue({
          code: "custom",
          message,
          path: [field],
        });
      }
    });
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
