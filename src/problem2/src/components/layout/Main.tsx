import { LayoutProps } from "@/types/layout";
import styled from "styled-components";
import Box from "../ui/Box";
import AppLayout from "../common/AppLayout";

const Container = styled(Box)`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Content = styled(Box)`
  width: 100vw;
  margin-top: 65px;
`;

export const MainLayout = (props: LayoutProps) => {
  return (
    <Container>
      <AppLayout />
      <Content>{props.children}</Content>
    </Container>
  );
};
