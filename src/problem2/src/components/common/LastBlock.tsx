import React from "react";
import Flex from "../ui/Flex";
import Box from "../ui/Box";
import styled from "styled-components";
import Text from "../ui/Text";
import { useFetchLastBlock } from "@/hooks/useFetchLastBlock";
import { theme } from "@/config";

const Dot = styled(Box)`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.statusGreen};
  border-radius: 50%;
`;
const LastBlock = () => {
  const { blockNumber, isLoading } = useFetchLastBlock();

  return (
    <Flex
      alignItems="center"
      style={{
        cursor: "pointer",
      }}
      onClick={() => {
        window.open("https://basescan.org/blocks");
      }}
    >
      <Dot />
      <Text ml="6px" fontSize="12px" fontWeight={600} color={theme.colors.statusGreen} lineHeight={1}>
        {isLoading ? "..." : blockNumber}
      </Text>
    </Flex>
  );
};

export default LastBlock;
