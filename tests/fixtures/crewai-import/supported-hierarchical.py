from crewai import Agent, Task, Crew, LLM, Process
llm = LLM(model="gpt-4o", temperature=0.1)
manager = LLM(model="gpt-4o", temperature=0.1)
worker = Agent(role="Worker", goal="Work", backstory="Specialist", llm=llm, verbose=True, allow_delegation=False, max_iter=8, max_rpm=None, max_execution_time=None, respect_context_window=True, cache=True, tools=[])
task = Task(description="Complete work", expected_output="Result", tools=[], context=[], async_execution=False)
crew = Crew(agents=[worker], tasks=[task], process=Process.hierarchical, manager_llm=manager, verbose=True, memory=True)
