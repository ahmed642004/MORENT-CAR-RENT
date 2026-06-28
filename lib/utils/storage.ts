export const getImageUrl = (path: string) => {
  const baseUrl =
    "https://auibwzoxtpckkjhgfrhx.supabase.co/storage/v1/object/public/car_images/";
  return `${baseUrl}${path}`;
};

export const getAvatarUrl = (path: string) => {
  const baseUrl =
    "https://auibwzoxtpckkjhgfrhx.supabase.co/storage/v1/sign/avatar/";
  return `${baseUrl}${path}`;
};
