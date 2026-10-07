export type SupportedLanguage = "python" | "javascript" | "java" | "cpp";

export interface LanguageConfig {
  id: SupportedLanguage;
  label: string;
  monacoLanguage: string;
  judge0Id: number;
  template: string;
}

export const languages: Record<SupportedLanguage, LanguageConfig> = {
  python: {
    id: "python",
    label: "Python",
    monacoLanguage: "python",
    judge0Id: 71, // Python 3
    template: `import sys

def main():
    pass


if __name__ == "__main__":
    main()
`,
  },
  javascript: {
    id: "javascript",
    label: "JavaScript",
    monacoLanguage: "javascript",
    judge0Id: 63, // Node.js
    template: `const readline = require('readline');

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const lines = [];
  rl.on('line', (line) => lines.push(line));
  rl.on('close', () => {
    // process lines here
  });
}

main();
`,
  },
  java: {
    id: "java",
    label: "Java",
    monacoLanguage: "java",
    judge0Id: 62, // Java (OpenJDK)
    template: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        while (scanner.hasNextLine()) {
            String line = scanner.nextLine().trim();
            if (line.isEmpty()) continue;
            // process line here
        }

        scanner.close();
    }
}
`,
  },
  cpp: {
    id: "cpp",
    label: "C++",
    monacoLanguage: "cpp",
    judge0Id: 54, // C++ (GCC)
    template: `#include <iostream>
#include <string>
#include <sstream>
#include <map>

using namespace std;

int main() {
    string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        // process line here
    }
    return 0;
}
`,
  },
};

export const languageList = Object.values(languages);
