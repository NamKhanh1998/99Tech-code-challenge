import React, { FC } from "react";
import styled from "styled-components";
import Flex from "../ui/Flex";
import Text from "../ui/Text";
import { theme } from "@/config";
import { inter } from "@/styles/fonts";
import { BoxProps } from "../ui/types";

const StyledPrice = styled(Flex)`
  align-items: center;
  gap: 4px;
`;

const PriceText = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
`;

const ChangeText = styled(Text)`
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
`;

const Price: FC<
  {
    price: string | number;
    change: string | number;
  } & BoxProps
> = ({ price, change, ...rest }) => {
  return (
    <StyledPrice {...rest}>
      <PriceText className={inter.className}>${price?.toLocaleString()}</PriceText>
      {!!change && (
        <ChangeText className={inter.className} color={Number(change) >= 0 ? theme.colors.green : theme.colors.red}>
          ({change}%)
        </ChangeText>
      )}
    </StyledPrice>
  );
};

export default Price;
