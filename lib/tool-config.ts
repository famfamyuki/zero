export interface ToolParameterDefinition {
  key: string;
  label: string;
  labelJa: string;
  placeholder: string;
  help: string;
  helpJa: string;
}

export const TOOL_PARAMETER_DEFINITIONS: Record<string, ToolParameterDefinition[]> = {
  SerperDevTool: [],
  ScrapeWebsiteTool: [
    { key: 'website_url', label: 'Website URL', labelJa: 'WebサイトURL', placeholder: '{website_url}', help: 'Optional fixed URL. Leave blank when the agent supplies URLs at runtime.', helpJa: 'URLを固定する場合に指定します。Agentが実行時にURLを渡す場合は空欄にできます。' },
  ],
  DirectoryReadTool: [
    { key: 'directory', label: 'Directory', labelJa: 'ディレクトリ', placeholder: '{source_directory}', help: 'Local directory available to the generated Python process.', helpJa: '生成したPythonからアクセスできるローカルディレクトリです。' },
  ],
  FileReadTool: [
    { key: 'file_path', label: 'File path', labelJa: 'ファイルパス', placeholder: '{source_file}', help: 'Local file path. Input placeholders such as {source_file} are supported.', helpJa: '{source_file}などの入力変数を利用できます。' },
  ],
  TXTSearchTool: [
    { key: 'txt', label: 'TXT file', labelJa: 'TXTファイル', placeholder: '{source_file}', help: 'TXT file to index for RAG search.', helpJa: 'RAG検索の対象にするTXTファイルです。' },
  ],
  PDFSearchTool: [
    { key: 'pdf', label: 'PDF file', labelJa: 'PDFファイル', placeholder: '{source_file}', help: 'PDF file to index for RAG search.', helpJa: 'RAG検索の対象にするPDFファイルです。' },
  ],
  CSVSearchTool: [
    { key: 'csv', label: 'CSV file', labelJa: 'CSVファイル', placeholder: '{source_file}', help: 'CSV file to index for RAG search.', helpJa: 'RAG検索の対象にするCSVファイルです。' },
  ],
  YoutubeVideoSearchTool: [
    { key: 'youtube_video_url', label: 'YouTube URL', labelJa: 'YouTube URL', placeholder: '{video_url}', help: 'Video URL to index for semantic search.', helpJa: 'セマンティック検索の対象にする動画URLです。' },
  ],
  GithubSearchTool: [
    { key: 'github_repo', label: 'GitHub repository', labelJa: 'GitHubリポジトリ', placeholder: '{repository_url}', help: 'Repository URL or owner/name target.', helpJa: 'リポジトリURLまたはowner/nameを指定します。' },
  ],
  MDXSearchTool: [
    { key: 'mdx', label: 'MDX file', labelJa: 'MDXファイル', placeholder: '{source_file}', help: 'MDX file to index for RAG search.', helpJa: 'RAG検索の対象にするMDXファイルです。' },
  ],
  CustomTool: [],
};

export function getToolParameterDefinitions(toolType?: string): ToolParameterDefinition[] {
  return TOOL_PARAMETER_DEFINITIONS[toolType || ''] || [];
}
