export const NoJsSquircle = () => {
  return (
    <noscript>
      <style type="text/css">{`[data-squircle] { clip-path: none !important; border-radius: attr(data-squircle) !important; }`}</style>
    </noscript>
  );
};
