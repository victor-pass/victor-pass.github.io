import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import path from "node:path";
import sharp from "sharp";

// Build-time images from each product's screenshots (PNGs under public/):
// shot-N.webp for the page carousel and product cards, and card.jpg, a 1200×630
// landscape of the first screenshot over a plain colour, for link previews.
const CARD = { width: 1200, height: 630, padding: 40, background: "#e9e2d6" };

export const getStaticPaths = (async () => {
    const products = await getCollection("products");

    return products.flatMap((product) => {
        const shots = product.data.screenshots ?? [];
        const slug = product.id;

        return [
            ...shots.map((src, i) => ({
                params: { slug, image: `shot-${i}.webp` },
                props: { src, card: false },
            })),
            ...shots.slice(0, 1).map((src) => ({
                params: { slug, image: "card.jpg" },
                props: { src, card: true },
            })),
        ];
    });
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
    const file = path.join(process.cwd(), "public", props.src);
    let image: Buffer;

    if (props.card) {
        const phone = await sharp(file)
            .resize({
                width: CARD.width - 2 * CARD.padding,
                height: CARD.height - 2 * CARD.padding,
                fit: "inside",
            })
            .toBuffer();

        // Multiply lets white screenshot backgrounds take on the card colour.
        image = await sharp({
            create: { width: CARD.width, height: CARD.height, channels: 3, background: CARD.background },
        })
            .composite([{ input: phone, blend: "multiply" }])
            .jpeg({ quality: 82, mozjpeg: true })
            .toBuffer();
    } else {
        image = await sharp(file).webp({ quality: 80 }).toBuffer();
    }

    return new Response(new Uint8Array(image));
};
