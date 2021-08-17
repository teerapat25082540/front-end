import React, { useState, useEffect } from "react";
import "../styles/ListSearch.css";

type Props = {
  data: object[];
  selectItem: any;
};

const ListSearch = ({ data, selectItem }: Props) => {
  const [isCheckData, setIsCheckData] = useState<boolean>(false);
  useEffect(() => {
    if (data.length === 0) {
      setIsCheckData(false);
    } else {
      setIsCheckData(true);
    }
  }, [data.length]);

  return (
    <div>
      {isCheckData ? (
        <div
          className="container-search"
          style={{
            position: "absolute",
            zIndex: 99,
            width: "100%",
            background: "white",
          }}
        >
          {data.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() => {
                selectItem(item);
              }}
              className="item-search"
            >
              {item.name}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ListSearch;
