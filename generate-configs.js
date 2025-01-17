const fs = require('fs');
const path = require('path');

// Adjust paths if needed
const configPath = path.join(__dirname, 'config.json');
const localizationsPath = path.join(__dirname, 'localizations.json');

// Read the base config file
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Read the localizations file
const localizations = JSON.parse(fs.readFileSync(localizationsPath, 'utf8'));

// For each language in localizations, create a new config file
Object.keys(localizations).forEach((lang) => {
  // Deep clone the base config so we don't mutate it
  const localizedConfig = JSON.parse(JSON.stringify(configData));

  // Apply localized title/body for each notification
  for (const notificationKey in localizedConfig.notifications) {
    // Check if language has the notification
    if (!localizations[lang][notificationKey]) {
      throw new Error(
        `Missing localization for notification "${notificationKey}" in language "${lang}"`
      );
    }

    const { title, body } = localizations[lang][notificationKey];

    // Check if required fields exist
    if (!title || !body) {
      throw new Error(
        `Missing title or body for notification "${notificationKey}" in language "${lang}"`
      );
    }

    // Assign values
    localizedConfig.notifications[notificationKey].title = title;
    localizedConfig.notifications[notificationKey].body = body;
  }

  // Write out the new file: config-<lang>.json
  const outputFileName = `config-${lang}.json`;
  fs.writeFileSync(outputFileName, JSON.stringify(localizedConfig, null, 2));
  console.log(`Created: ${outputFileName}`);
});
