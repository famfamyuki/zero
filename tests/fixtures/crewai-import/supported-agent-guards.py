# CrewAI Autonomous Agent Flow: Guarded Crew
from crewai import Agent as A, Task as T, Crew as C, LLM, Process
llm = LLM(model="ollama/llama3", temperature=0.1, base_url="http://localhost:11434")
agent = A(role="Guarded", goal="Work safely", backstory="Expert", llm=llm, verbose=False, allow_delegation=True, max_iter=7, max_rpm=20, max_execution_time=60, respect_context_window=False, cache=False, tools=[])
task = T(description="Create markdown", expected_output="A file", agent=agent, tools=[], context=[], async_execution=True, markdown=True, output_file="result.md", human_input=True)
crew = C(agents=[agent], tasks=[task], process=Process.sequential, verbose=False, memory=True)
