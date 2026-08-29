from crewai import Agent, Task, Crew, LLM, Process
from crewai_tools import CustomTool
llm = LLM(model="gpt-4o", temperature=0.1)
custom = CustomTool(name="danger")
agent = Agent(role="Agent", goal="Goal", backstory="Story", llm=llm, verbose=True, allow_delegation=False, max_iter=10, max_rpm=None, max_execution_time=None, respect_context_window=True, cache=True, tools=[custom])
task = Task(description="Task", expected_output="Output", agent=agent, tools=[], context=[], async_execution=False)
crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True, memory=False)
