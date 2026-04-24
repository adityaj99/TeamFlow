export const getAvatar = (user) => {
  if (user?.avatar) return user.avatar;

  const fullName = user?.name || "User";

  const nameParts = fullName.trim().split(" ");
  const name = nameParts[0];

  return `https://ui-avatars.com/api/?name=${name}&background=random&size=128`;
};
