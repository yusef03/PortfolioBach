interface Project {
  id: string;
  titleKey: string;
  descKey: string;
  btnKey: string;
  codeKey: string;
  image: string;
  linkDetails: string;
  linkCode: string;
  badges: string[];
  features: string[];
  statusKey: string;
  timeframe?: string;
  role?: string;
}

interface Translations {
  [lang: string]: {
    [key: string]: string;
  };
}

// EmailJS Type Declaration since it's loaded via CDN
declare namespace emailjs {
  function init(publicKey: string): void;
  function sendForm(serviceID: string, templateID: string, form: HTMLFormElement): Promise<any>;
}
