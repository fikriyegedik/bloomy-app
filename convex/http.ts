// To avoid malition user login attemt we should make sure that the event is coming from Clerk
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async ( ctx, request ) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error('Missing webhook secret. Add it to your environment variables.')}

        //check headers
        const svix_id = request.headers.get('svix-id');
        const svix_timestamp = request.headers.get('svix-timestamp');
        const svix_signature = request.headers.get('svix-signature');

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new Response("Error Occurred", { status: 400 });
        }

        const payload = await request.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook(webhookSecret);
        let evt:any;

        //verify webhook
        try{
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature
            }) as any;
        }catch(err){
            console.error( "Error verifying webhook:" ,err);
            return new Response("Error Occurred", { status: 400 });
        }

        const eventType = evt.type;

        if (eventType === "user.created") {
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;

            const email = email_addresses[0].email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            try{
                await ctx.runMutation(api.users.createUser, {
                    email,
                    fullName: name,
                    image: image_url,
                    clerkId: id,
                    userName: email.split("@")[0],
                    followers: 0,
                    following: 0,
                    posts: 0,
                })
            } catch(err){
                console.error( "Error creating user:" ,err);
                return new Response("Error Occurred", { status: 400 });
            }
        }

        return new Response("webhook processed", { status: 200 });

    })
});
export default http;