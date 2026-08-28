from crewai import Agent, Task, Crew, LLM, Process

llm = LLM(model="gpt-4o", temperature=0.1)
researcher = Agent(role="Researcher", goal="Find facts", backstory="Careful analyst", llm=llm, verbose=True, allow_delegation=False, max_iter=10, max_rpm=None, max_execution_time=None, respect_context_window=True, cache=True, tools=[])
research_task = Task(description="Research {topic}", expected_output="A concise report", agent=researcher, tools=[], context=[], async_execution=False)
crew = Crew(agents=[researcher], tasks=[research_task], process=Process.sequential, verbose=True, memory=False)
