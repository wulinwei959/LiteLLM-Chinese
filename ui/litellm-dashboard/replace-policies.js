const fs = require('fs');

const filePath = 'src/app/(dashboard)/policies/_components/index.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Build the old string with the exact HTML entity
const arrow = '-' + '&'.concat('gt;');
const oldStr = 'Learn more in the documentation ' + arrow + '\n    </a>';
const newStr = '{t("learnMore")}\n    </a>';

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  console.log('Step 1: learnMore replaced');
} else {
  console.log('Step 1 failed');
}

// Replace About Policies title
const oldTitle = 'title="About Policies"';
const newTitle = 'title={t("aboutTitle")}';
if (content.includes(oldTitle)) {
  content = content.replace(oldTitle, newTitle);
  console.log('Step 2: title replaced');
} else {
  console.log('Step 2 failed');
}

// Replace the description
const oldDesc = 'Use policies to group guardrails and control which ones run for specific teams, keys, or models.';
const newDesc = '{t("aboutDescription")}';
if (content.includes(oldDesc)) {
  content = content.replace(oldDesc, newDesc);
  console.log('Step 3: description replaced');
} else {
  console.log('Step 3 failed');
}

// Replace Why use policies
const oldWhy = 'Why use policies?';
const newWhy = '{t("whyUsePolicies")}';
if (content.includes(oldWhy)) {
  content = content.replace(oldWhy, newWhy);
  console.log('Step 4: whyUse replaced');
} else {
  console.log('Step 4 failed');
}

// Replace the reasons
const reasons = [
  ['Enable/disable specific guardrails for teams, keys, or models', 'reason1'],
  ['Group guardrails into a single policy', 'reason2'],
  ['Inherit from existing policies and override what you need', 'reason3'],
];
reasons.forEach(([oldText, key], i) => {
  if (content.includes(oldText)) {
    content = content.replace(oldText, `{t("${key}")}`);
    console.log(`Step ${5 + i}: ${key} replaced`);
  } else {
    console.log(`Step ${5 + i}: ${key} FAILED`);
  }
});

// Add useTranslations to AboutPoliciesAlert
const oldFunc = 'const AboutPoliciesAlert = () => (';
const newFunc = 'const AboutPoliciesAlert = () => {\n  const t = useTranslations("policies");\n\n  return (';
if (content.includes(oldFunc)) {
  content = content.replace(oldFunc, newFunc);
  console.log('Step 8: function opening replaced');
} else {
  console.log('Step 8 failed');
}

// Fix the closing of the function - need to add closing brace
// The original ends with:  </DismissibleAlert>\n);
// New should end with:  </DismissibleAlert>\n  );\n};
const oldClose = '  </DismissibleAlert>\n);';
const newClose = '  </DismissibleAlert>\n  );\n};';
if (content.includes(oldClose)) {
  content = content.replace(oldClose, newClose);
  console.log('Step 9: function closing replaced');
} else {
  console.log('Step 9 failed');
}

fs.writeFileSync(filePath, content);
console.log('File saved');