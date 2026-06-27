export const getImageUrl = (path: string) => {
  const baseUrl =
    "https://auibwzoxtpckkjhgfrhx.supabase.co/storage/v1/object/public/car_images/";
  return `${baseUrl}${path}`;
};
