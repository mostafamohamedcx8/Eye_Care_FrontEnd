import { useState, useEffect } from "react";

const BASE_URL = "https://auge.cloud/wp-json/wp/v2";

const fetchImageUrl = async (id) => {
  const res = await fetch(`${BASE_URL}/media/${id}`);
  const data = await res.json();
  return data.source_url;
};

const usePageData = (pageId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${BASE_URL}/pages/${pageId}`);
      const json = await res.json();
      const acf = json.acf;

      const [bgUrl, logoUrl, welcomeUrl] = await Promise.all([
        fetchImageUrl(acf.hero_background),
        fetchImageUrl(acf.hero_logo),
        fetchImageUrl(acf.welcome_image),
      ]);

      setData({
        ...acf,
        hero_background: bgUrl,
        hero_logo: logoUrl,
        welcome_image: welcomeUrl,
      });

      setLoading(false);
    };

    fetchData();
  }, [pageId]);

  return { data, loading };
};

export default usePageData;
