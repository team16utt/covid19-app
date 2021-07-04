import React, { memo } from "react";
import vnTopo from "../../GeoData/vn.json";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";

import Covid19Vn from "../../Api/Covid19Vn/Covid19Vn";

const VnMap = ({ setTooltipContent, onClickProvince, province, position }) => {
  

  const marker = {
    markerOffset: -30,
    name: "",
    coordinates: [position.longitude, position.latitude],
  };

  const drawColor = (cases) => {
    if (cases < 10) {
      return {
        default: {
          fill: "#ACCDDC",
          outline: "none",
        },
        hover: {
          fill: "#F53",
          outline: "none",
        },
        pressed: {
          fill: "#E42",
          outline: "none",
        },
      };
    } else if (cases >= 10 && cases < 50) {
      return {
        default: {
          fill: "#4A97B9",
          outline: "none",
        },
        hover: {
          fill: "#F53",
          outline: "none",
        },
        pressed: {
          fill: "#E42",
          outline: "none",
        },
      };
    } else {
      return {
        default: {
          fill: "#006491",
          outline: "none",
        },
        hover: {
          fill: "#F53",
          outline: "none",
        },
        pressed: {
          fill: "#E42",
          outline: "none",
        },
      };
    }
  };

  const getProvinceByName = (name) => {
    try {
      const p = province.filter((e) => {
        return e.Province_Name === name;
      });
      const [obj] = p;
      return obj;
    } catch (error) {
      return {};
    }
  };

  return (
    <>
      <ComposableMap
        projectionConfig={{ scale: 1700 }}
        data-tip=""
        projection="geoEquirectangular"
      >
        <ZoomableGroup zoom={1} maxZoom={1} minZoom={1} center={[106, 16]}>
          <Geographies geography={vnTopo}>
            {({ geographies }) => {
              // console.log(geographies);
              return geographies.map((geography, i) => {
                const { NAME_1 } = geography.properties;
                // console.log(geography.geometry.coordinates);

                const { Confirmed, Recovered, Deaths } = getProvinceByName(
                  NAME_1
                )
                  ? getProvinceByName(NAME_1)
                  : {
                      Province_Name: `${NAME_1}`,
                      Confirmed: 0,
                      Deaths: 0,
                      Recovered: 0,
                    };

                return (
                  <Geography
                    key={i}
                    geography={geography}
                    onMouseEnter={() =>
                      setTooltipContent(
                        `${NAME_1} - Dương tính: ${Confirmed} - Phục hồi: ${Recovered} - Tử vong: ${Deaths}`
                      )
                    }
                    onClick={() => onClickProvince({ value: `${NAME_1}` })}
                    onMouseLeave={() => setTooltipContent("")}
                    style={drawColor(Confirmed)}
                  />
                );
              });
            }}
          </Geographies>
          {position.longitude !== undefined && (
            <Marker coordinates={marker.coordinates}>
              <g
                fill="none"
                stroke="#FF5533"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -24)"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
              </g>
              <text
                textAnchor="middle"
                y={marker.markerOffset}
                style={{
                  fontFamily: "system-ui",
                  fill: "#5D5A6D",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {marker.name}
              </text>
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(VnMap);
