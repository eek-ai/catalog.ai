import { index, route } from "@react-router/dev/routes";

export default [
  index("./routes/browse.jsx", { id: "browse-tools-uk" }),
  route("company", "./routes/browse.jsx", { id: "browse-companies-uk" }),
  route("platform", "./routes/browse.jsx", { id: "browse-platforms-uk" }),
  route("tool/:id", "./routes/detail.jsx", { id: "detail-uk" }),
  route("en", "./routes/browse.jsx", { id: "browse-tools-en" }),
  route("en/company", "./routes/browse.jsx", { id: "browse-companies-en" }),
  route("en/platform", "./routes/browse.jsx", { id: "browse-platforms-en" }),
  route("en/tool/:id", "./routes/detail.jsx", { id: "detail-en" }),
];
