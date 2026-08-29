from crewai import Agent, Task, Crew, LLM, Process
llm = LLM(model="gpt-4o", temperature=0.1)
agent = Agent(role="Agent", goal="Goal", backstory="Story", llm=llm, verbose=True, allow_delegation=False, max_iter=10, max_rpm=None, max_execution_time=None, respect_context_window=True, cache=True, tools=[])
first = Task(description="First", expected_output="First", agent=agent, tools=[], context=[second], async_execution=False)
second = Task(description="Second", expected_output="Second", agent=agent, tools=[], context=[], async_execution=False)
crew = Crew(agents=[agent], tasks=[first, second], process=Process.sequential, verbose=True, memory=False)
