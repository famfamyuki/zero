from crewai.project import CrewBase, crew
@CrewBase
class Project:
    @crew
    def crew(self):
        return Crew(agents=self.agents, tasks=self.tasks)
