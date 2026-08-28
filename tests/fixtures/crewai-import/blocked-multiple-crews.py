from crewai import Crew, Process
one = Crew(agents=[], tasks=[], process=Process.sequential, verbose=True, memory=False)
two = Crew(agents=[], tasks=[], process=Process.sequential, verbose=True, memory=False)
