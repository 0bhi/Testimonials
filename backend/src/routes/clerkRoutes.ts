import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

interface ExternalAccount {
  object: string;
  google_id: string;
}

interface EmailAddress {
  email_address: string;
}

interface UserData {
  id: string;
  email_addresses: EmailAddress[];
  first_name: string;
  last_name: string;
  external_accounts: ExternalAccount[];
}

router.post("/", async (req, res) => {
  const { type, data } = req.body;

  if (type === "user.created") {
    const { id, email_addresses, first_name, last_name, external_accounts } =
      data;
    const email = email_addresses[0].email_address;

    const googleAccount: ExternalAccount | undefined = external_accounts.find(
      (account: ExternalAccount) => account.object === "google_account"
    );
    const googleId = googleAccount ? googleAccount.google_id : null;

    try {
      await prisma.user.create({
        data: {
          id,
          email,
          firstName: first_name,
          lastName: last_name,
          googleId,
        },
      });
      res.status(200).send("User created");
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(400).send("Event type not supported");
  }
});

export const clerkRoutes = router;
