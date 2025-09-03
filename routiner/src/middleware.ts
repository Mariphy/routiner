export { auth as middleware } from "@/auth";
export const config = { 
    matcher: ["/board", "/calendar"],
    runtime: 'nodejs',
};