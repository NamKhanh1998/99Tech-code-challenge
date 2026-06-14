import Logo from "../common/Logo";
import Flex from "../ui/Flex";

const WalletAvatar = () => {
  return (
    <Flex width="100%" height="100%" alignItems="center" justifyContent="center">
      <Logo width={70} height={50} />
    </Flex>
  );
};

export default WalletAvatar;
