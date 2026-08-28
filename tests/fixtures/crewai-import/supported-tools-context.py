from crewai import Agent, Task, Crew, LLM, Process
from crewai_tools import SerperDevTool, ScrapeWebsiteTool
llm = LLM(model="gpt-4o", temperature=0.1)
search = SerperDevTool()
scrape = ScrapeWebsiteTool(website_url="https://example.com")
researcher = Agent(role="Researcher", goal="Research", backstory="Analyst", llm=llm, verbose=True, allow_delegation=False, max_iter=10, max_rpm=None, max_execution_time=None, respect_context_window=True, cache=True, tools=[search])
writer = Agent(role="Writer", goal="Write", backstory="Editor", llm=llm, verbose=True, allow_delegation=False, max_iter=10, max_rpm=None, max_execution_time=None, respect_context_window=True, cache=True, tools=[])
research = Task(description="Research", expected_output="Notes", agent=researcher, tools=[scrape], context=[], async_execution=False)
write = Task(description="Write", expected_output="Article", agent=writer, tools=[], context=[research], async_execution=False)
crew = Crew(agents=[researcher, writer], tasks=[research, write], process=Process.sequential, verbose=True, memory=False)
