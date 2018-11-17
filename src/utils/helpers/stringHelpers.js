export const capitalize = function(string) {
  // Exclude intentional words like iPhone, dBud
  if (string.charAt(1) === string.charAt(1).toUpperCase()) {
    return string;
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const titleize = function(string) {
  var string_array = string.split(' ');
  string_array = string_array.map(function(str) {
    return capitalize(str);
  });

  return string_array.join(' ');
}

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}