"use client";

import { Mail, Phone } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function Card1() {
  return (
    <Card className="mx-auto my-12 max-w-sm pb-0">
      <CardHeader>
        <div className="relative flex flex-col gap-3 md:flex-row md:items-start">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User avatar"
            />
          </Avatar>
          <div className="space-y-0.5">
            <h3 className="text-card-foreground text-base leading-6 font-semibold">
              Title Text
            </h3>
            <p className="text-muted-foreground text-sm">
              This is a card description.
            </p>
          </div>
          <Badge className="absolute top-0 right-0">Admin</Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-between gap-2 border-t py-4!">
        <Button variant="ghost" size="sm" className="flex-1">
          <Mail />
          Email
        </Button>
        <Separator orientation="vertical" className="h-5!" />
        <Button variant="ghost" size="sm" className="flex-1">
          <Phone />
          Call
        </Button>
      </CardFooter>
    </Card>
  );
}
