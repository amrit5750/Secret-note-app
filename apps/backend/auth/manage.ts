import Jwt from "jsonwebtoken";
import Boom from "@hapi/boom";
export function registerManageAuth(server: any) {
  server.auth.scheme("manage", () => ({
    authenticate: (req: any, h: any) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      try {
        const payload = Jwt.verify(token, process.env.JWT_SECRET!);
        return h.authenticated({ credentials: payload });
      } catch {
        throw Boom.unauthorized();
      }
    },
  }));
  server.auth.strategy("manage", "manage");
}
export function signManageJWT(payload: any) {
  return Jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "30m" });
}
