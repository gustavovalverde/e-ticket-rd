"use client";

import { zodValidator } from "@tanstack/zod-form-adapter";
import { Shield, DollarSign, Leaf, Package, InfoIcon } from "lucide-react";
import React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  carriesOverTenThousandSchema,
  carriesAnimalsOrFoodSchema,
  carriesTaxableGoodsSchema,
} from "@/lib/schemas/validation";
import { getErrorMessage } from "@/lib/utils";

interface CustomsDeclarationStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onNext: () => void;
  onPrevious: () => void;
}

export function CustomsDeclarationStep({ form }: CustomsDeclarationStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Customs Declaration
        </h2>
        <p className="text-muted-foreground">
          Please declare any restricted items, currency, or goods for customs
          processing
        </p>
      </div>

      {/* Money Declaration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Money and Currency Declaration
          </CardTitle>
          <CardDescription>
            Declaration of money and financial instruments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.Field
            name="customsDeclaration.carriesOverTenThousand"
            validators={{ onChange: carriesOverTenThousandSchema }}
            validatorAdapter={zodValidator}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Are you carrying more than US$10,000 (or equivalent) in cash,
                  checks, or other monetary instruments?
                </Label>
                <RadioGroup
                  value={field.state.value ? "yes" : "no"}
                  onValueChange={(value) => field.handleChange(value === "yes")}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="no" id="money-no" />
                    <Label htmlFor="money-no" className="flex-1 cursor-pointer">
                      <div className="font-medium">No</div>
                      <div className="text-muted-foreground text-sm">
                        Less than US$10,000
                      </div>
                    </Label>
                  </div>
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="yes" id="money-yes" />
                    <Label
                      htmlFor="money-yes"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Yes</div>
                      <div className="text-muted-foreground text-sm">
                        US$10,000 or more
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-muted-foreground text-sm">
                  This includes cash, traveler&apos;s checks, money orders, and
                  other monetary instruments
                </p>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* Prohibited Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Agricultural and Food Products
          </CardTitle>
          <CardDescription>
            Declaration of plants, animals, food, and biological materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.Field
            name="customsDeclaration.carriesAnimalsOrFood"
            validators={{ onChange: carriesAnimalsOrFoodSchema }}
            validatorAdapter={zodValidator}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Are you carrying any live animals, plants, food products, or
                  biological materials?
                </Label>
                <RadioGroup
                  value={field.state.value ? "yes" : "no"}
                  onValueChange={(value) => field.handleChange(value === "yes")}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="no" id="bio-no" />
                    <Label htmlFor="bio-no" className="flex-1 cursor-pointer">
                      <div className="font-medium">No</div>
                      <div className="text-muted-foreground text-sm">
                        No biological materials
                      </div>
                    </Label>
                  </div>
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="yes" id="bio-yes" />
                    <Label htmlFor="bio-yes" className="flex-1 cursor-pointer">
                      <div className="font-medium">Yes</div>
                      <div className="text-muted-foreground text-sm">
                        Carrying biological items
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-muted-foreground text-sm">
                  This includes fruits, vegetables, meat, dairy products, seeds,
                  plants, live animals, or soil
                </p>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* Taxable Goods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Taxable Goods and Merchandise
          </CardTitle>
          <CardDescription>
            Declaration of commercial goods and taxable items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.Field
            name="customsDeclaration.carriesTaxableGoods"
            validators={{ onChange: carriesTaxableGoodsSchema }}
            validatorAdapter={zodValidator}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Are you carrying goods for commercial purposes or items
                  subject to customs duties?
                </Label>
                <RadioGroup
                  value={field.state.value ? "yes" : "no"}
                  onValueChange={(value) => field.handleChange(value === "yes")}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="no" id="goods-no" />
                    <Label htmlFor="goods-no" className="flex-1 cursor-pointer">
                      <div className="font-medium">No</div>
                      <div className="text-muted-foreground text-sm">
                        Personal items only
                      </div>
                    </Label>
                  </div>
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="yes" id="goods-yes" />
                    <Label
                      htmlFor="goods-yes"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Yes</div>
                      <div className="text-muted-foreground text-sm">
                        Commercial or taxable goods
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-muted-foreground text-sm">
                  This includes items for sale, business samples, gifts over
                  duty-free limits, or restricted items
                </p>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* Group Benefits */}
      <form.Field name="groupTravel.isGroupTravel">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(groupField: any) => {
          if (!groupField.state.value) return null;

          return (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Family declarations:</strong> Since you&apos;re
                traveling as a group, you can share these declarations for
                family members traveling together. Individual declarations can
                be made if needed for specific travelers.
              </AlertDescription>
            </Alert>
          );
        }}
      </form.Field>

      {/* Legal Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Legal Notice:</strong> Providing false information on customs
          declarations is a serious offense and may result in penalties, fines,
          or legal action. Please answer all questions truthfully.
        </AlertDescription>
      </Alert>
    </div>
  );
}
