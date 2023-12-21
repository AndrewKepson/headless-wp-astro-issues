import UnitedStatesImage from "../assets/images/regions/unites-states.webp";
import CanadaImage from "../assets/images/regions/canada.png";
import NorthernAfricaImage from "../assets/images/regions/northern-africa.jpeg";
import LatinAmericaImage from "../assets/images/regions/latin-america.jpeg";
import WesternEuropeImage from "../assets/images/regions/western-europe.png";

export const getRegionFeaturedImage = (region) => {
  switch (region) {
    case "united-states":
      return UnitedStatesImage;
    case "canada":
      return CanadaImage;
    case "northern-africa":
      return NorthernAfricaImage;
    case "latin-america":
      return LatinAmericaImage;
    case "western-europe":
      return WesternEuropeImage;
    default:
      return null;
  }
};

// * Utility Functions
export function sortArrayObjectsByProperty(arr, property) {
  // Check if the array is not null and every element has the specified property
  if (!arr || !arr.every((element) => element.hasOwnProperty(property))) {
    throw new Error(`Every element must have the property '${property}'`);
  }

  return arr.sort((a, b) => {
    let propA = a[property];
    let propB = b[property];

    // Assuming the properties are strings
    return propA.localeCompare(propB);
  });
}

export function sortEdgesByTitle(edges) {
  // Check if the edges array is not null and every edge has a node with a title
  if (!edges || !edges.every((edge) => edge.node && edge.node.title)) {
    throw new Error("Each edge must have a node with a title");
  }

  return edges.sort((a, b) => {
    let titleA = a.node.title.toLowerCase();
    let titleB = b.node.title.toLowerCase();
    return titleA.localeCompare(titleB);
  });
}
