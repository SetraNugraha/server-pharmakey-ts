const generateSlug = (name: string) => {
  return name
    .toLowerCase() // Convert all letters to lowercase
    .replace(/ /g, "-") // Replace spaces with "-"
    .replace(/[^\w-]+/g, "") // Remove all non-alphanumeric characters except "-"
    .replace(/--+/g, "-") // Replace multiple consecutive "-" with a single "-"
    .replace(/^-+/, "") // Remove leading "-" from the string
    .replace(/-+$/, ""); // Remove trailing "-" from the string
};

export default generateSlug;
