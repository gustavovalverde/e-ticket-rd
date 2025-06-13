"use client";

import { Shield, DollarSign, Leaf, Package, InfoIcon } from "lucide-react";
import React from "react";

import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  validateCarriesOverTenThousand,
  validateCarriesAnimalsOrFood,
  validateCarriesTaxableGoods,
} from "@/lib/schemas/validation";
import { booleanFieldAdapter } from "@/lib/utils/form-utils";

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
  return (
    <div className="space-y-6">
      {/* Money Declaration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Money and Monetary Instruments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="customsDeclaration.carriesOverTenThousand"
            validators={{
              onBlur: ({ value }: { value: boolean }) => {
                if (value === null || value === undefined) {
                  return "Please select if you're carrying over $10,000";
                }
                const result = validateCarriesOverTenThousand.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormRadioGroup
                field={booleanFieldAdapter(field)}
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
                description="Includes cash, traveler's checks, and money orders"
              />
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
        </CardHeader>
        <CardContent>
          <form.AppField
            name="customsDeclaration.carriesAnimalsOrFood"
            validators={{
              onBlur: ({ value }: { value: boolean }) => {
                if (value === null || value === undefined) {
                  return "Please select if you're carrying biological materials";
                }
                const result = validateCarriesAnimalsOrFood.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormRadioGroup
                field={booleanFieldAdapter(field)}
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
                description="Includes food, plants, animals, and soil"
              />
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
        </CardHeader>
        <CardContent>
          <form.AppField
            name="customsDeclaration.carriesTaxableGoods"
            validators={{
              onBlur: ({ value }: { value: boolean }) => {
                if (value === null || value === undefined) {
                  return "Please select if you're carrying taxable goods";
                }
                const result = validateCarriesTaxableGoods.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormRadioGroup
                field={booleanFieldAdapter(field)}
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
                description="Includes commercial items and gifts over duty-free limits"
              />
            )}
          </form.AppField>
        </CardContent>
      </Card>

      {/* Information Alert */}
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Providing false customs information may
          result in legal consequences.
        </AlertDescription>
      </Alert>
    </div>
  );
}
