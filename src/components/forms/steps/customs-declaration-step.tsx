"use client";

import { Shield, DollarSign, Leaf, Package, InfoIcon } from "lucide-react";
import React from "react";

import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  carriesOverTenThousandSchema,
  carriesAnimalsOrFoodSchema,
  carriesTaxableGoodsSchema,
} from "@/lib/schemas/validation";

import type { AnyFieldApi } from "@tanstack/react-form";

// Constants for icon colors to avoid duplication
const ICON_COLORS = {
  GREEN: "text-green-600",
  YELLOW: "text-yellow-600",
  ORANGE: "text-orange-600",
  RED: "text-red-600",
} as const;

interface CustomsDeclarationStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onNext: () => void;
  onPrevious: () => void;
}

export function CustomsDeclarationStep({ form }: CustomsDeclarationStepProps) {
  // Helper function to handle boolean to string conversion for radio groups
  const createBooleanFieldAdapter = (field: AnyFieldApi) => {
    // Handle undefined values by defaulting to false (which shows as "no")
    const booleanValue = field.state.value === true;
    const currentValue = booleanValue ? "yes" : "no";

    const handleValueChange = (value: string) => {
      field.handleChange(value === "yes");
    };

    return {
      ...field,
      state: { ...field.state, value: currentValue },
      handleChange: handleValueChange,
    } as AnyFieldApi;
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Customs Declaration
        </h2>
        <p className="text-muted-foreground">
          Please answer these questions honestly and accurately
        </p>
      </div>

      {/* Money Declaration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Money and Monetary Instruments
          </CardTitle>
          <CardDescription>
            Declaration for cash and monetary instruments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="customsDeclaration.carriesOverTenThousand"
            validators={{
              onChange: ({ value }: { value: boolean }) => {
                const result = carriesOverTenThousandSchema.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <div className="space-y-4">
                <FormRadioGroup
                  field={createBooleanFieldAdapter(field)}
                  options={[
                    {
                      value: "no",
                      id: "money-no",
                      label: "No",
                      description: "Less than US$10,000",
                      icon: <Shield className="h-5 w-5" />,
                      iconColor: ICON_COLORS.GREEN,
                    },
                    {
                      value: "yes",
                      id: "money-yes",
                      label: "Yes",
                      description: "US$10,000 or more",
                      icon: <DollarSign className="h-5 w-5" />,
                      iconColor: ICON_COLORS.YELLOW,
                    },
                  ]}
                  layout="grid"
                  columns="2"
                  padding="small"
                  size="small"
                />
                <p className="text-muted-foreground text-sm">
                  This includes cash, traveler&apos;s checks, money orders, and
                  other monetary instruments
                </p>
              </div>
            )}
          </form.AppField>
        </CardContent>
      </Card>

      {/* Prohibited Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Biological Materials
          </CardTitle>
          <CardDescription>
            Declaration for animals, plants, and food products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="customsDeclaration.carriesAnimalsOrFood"
            validators={{
              onChange: ({ value }: { value: boolean }) => {
                const result = carriesAnimalsOrFoodSchema.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <div className="space-y-4">
                <FormRadioGroup
                  field={createBooleanFieldAdapter(field)}
                  options={[
                    {
                      value: "no",
                      id: "bio-no",
                      label: "No",
                      description: "No biological materials",
                      icon: <Shield className="h-5 w-5" />,
                      iconColor: ICON_COLORS.GREEN,
                    },
                    {
                      value: "yes",
                      id: "bio-yes",
                      label: "Yes",
                      description: "Carrying biological items",
                      icon: <Leaf className="h-5 w-5" />,
                      iconColor: ICON_COLORS.ORANGE,
                    },
                  ]}
                  layout="grid"
                  columns="2"
                  padding="small"
                  size="small"
                />
                <p className="text-muted-foreground text-sm">
                  This includes fruits, vegetables, meat, dairy products, seeds,
                  plants, live animals, or soil
                </p>
              </div>
            )}
          </form.AppField>
        </CardContent>
      </Card>

      {/* Taxable Goods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Taxable Goods
          </CardTitle>
          <CardDescription>
            Declaration for commercial goods and taxable items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="customsDeclaration.carriesTaxableGoods"
            validators={{
              onChange: ({ value }: { value: boolean }) => {
                const result = carriesTaxableGoodsSchema.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <div className="space-y-4">
                <FormRadioGroup
                  field={createBooleanFieldAdapter(field)}
                  options={[
                    {
                      value: "no",
                      id: "goods-no",
                      label: "No",
                      description: "Personal items only",
                      icon: <Shield className="h-5 w-5" />,
                      iconColor: ICON_COLORS.GREEN,
                    },
                    {
                      value: "yes",
                      id: "goods-yes",
                      label: "Yes",
                      description: "Commercial or taxable goods",
                      icon: <Package className="h-5 w-5" />,
                      iconColor: ICON_COLORS.RED,
                    },
                  ]}
                  layout="grid"
                  columns="2"
                  padding="small"
                  size="small"
                />
                <p className="text-muted-foreground text-sm">
                  This includes items for sale, business samples, gifts over
                  duty-free limits, or restricted items
                </p>
              </div>
            )}
          </form.AppField>
        </CardContent>
      </Card>

      {/* Information Alert */}
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Providing false information on customs
          declarations is a violation of Dominican Republic law and may result
          in fines, confiscation of goods, or other legal consequences.
        </AlertDescription>
      </Alert>
    </div>
  );
}
