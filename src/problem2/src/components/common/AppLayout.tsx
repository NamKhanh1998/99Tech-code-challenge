import { devices } from "@/config";
import styled from "styled-components";
import Flex from "../ui/Flex";
import TopNav from "./TopNav";
import LastBlock from "./LastBlock";

const StyledMenu = styled(Flex)`
  position: relative;
  height: 100%;
`;

const Footer = styled(Flex)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: none;
  @media ${devices.tablet} {
    display: flex;
  }
`;

const AppLayout = () => {
  return (
    <StyledMenu>
      <TopNav />
      <Footer>
        <LastBlock />
      </Footer>
    </StyledMenu>
  );
};

export default AppLayout;
